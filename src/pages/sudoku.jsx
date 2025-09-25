import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Lightbulb as LightbulbIcon } from "@mui/icons-material";
import { getSudoku } from "sudoku-gen";

const textTo2dArray = (txt) => {
  const rows = [];
  for (let r = 0; r < 9; r++) {
    const row = [];
    for (let c = 0; c < 9; c++) {
      const p = txt[r * 9 + c];
      row.push(p === "-" ? "" : p);
    }
    rows.push(row);
  }
  return rows;
};

const isRowValid = (board, r, c, val) =>
  !board[r].some((cell, cc) => cell === val && cc !== c);
const isColValid = (board, r, c, val) =>
  !board.some((row, rr) => row[c] === val && rr !== r);
const isBoxValid = (board, r, c, val) => {
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let rr = br; rr < br + 3; rr++) {
    for (let cc = bc; cc < bc + 3; cc++) {
      if ((rr !== r || cc !== c) && board[rr][cc] === val) return false;
    }
  }
  return true;
};
const isValidMove = (board, r, c, val) => {
  if (val === "") return true;
  return (
    isRowValid(board, r, c, val) &&
    isColValid(board, r, c, val) &&
    isBoxValid(board, r, c, val)
  );
};

function SudokuBoard({
  board,
  fixed,
  onCellChange,
  showSolution,
  solution,
  errorCells,
  selectedCell,
  onCellFocus,
  editable,
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ display: "inline-block", margin: "auto" }}>
        {board.map((row, r) => (
          <Box key={r} sx={{ display: "flex" }}>
            {row.map((cell, c) => {
              const isFixed = fixed?.[r]?.[c];
              const val = showSolution && solution?.length ? solution[r][c] : cell || "";
              const hasError = errorCells.has(`${r},${c}`);
              const isSelected =
                selectedCell?.row === r && selectedCell?.col === c;
              const isInSameRow = selectedCell?.row === r;
              const isInSameCol = selectedCell?.col === c;
              const inSameBox =
                Math.floor(r / 3) === Math.floor(selectedCell?.row / 3) &&
                Math.floor(c / 3) === Math.floor(selectedCell?.col / 3);
              const highlight =
                isInSameRow || isInSameCol || inSameBox
                  ? "rgba(0, 123, 255, 0.12)"
                  : isSelected
                  ? "rgba(0, 123, 255, 0.25)"
                  : "transparent";

              const borderTop = r % 3 === 0 ? 2 : 1;
              const borderBottom = r % 3 === 2 ? 2 : 1;
              const borderLeft = c % 3 === 0 ? 2 : 1;
              const borderRight = c % 3 === 2 ? 2 : 1;

              return (
                <Tooltip
                  key={c}
                  title={hasError ? "Wrong number" : ""}
                  arrow
                  disableHoverListener={!hasError}
                >
                  <TextField
                    value={val}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^1-9]/g, "");
                      const v = raw === "" ? "" : raw[raw.length - 1];
                      onCellChange(r, c, v);
                    }}
                    onFocus={() => onCellFocus(r, c)}
                    onKeyUp={() => onCellChange(r, c, board[r][c])}
                    inputProps={{
                      style: {
                        textAlign: "center",
                        fontSize: "1.4rem",
                        width: "2.8rem",
                        height: "2.8rem",
                        padding: 0,
                      },
                    }}
                    sx={{
                      margin: 0,
                      borderTop: `${borderTop}px solid #000`,
                      borderBottom: `${borderBottom}px solid #000`,
                      borderLeft: `${borderLeft}px solid #000`,
                      borderRight: `${borderRight}px solid #000`,
                      backgroundColor: highlight,
                      borderColor: hasError ? "#d32f2f" : "#000",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: 0,
                        },
                      },
                    }}
                    disabled={!editable && !isFixed}
                  />
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("easy");
  const [puzzle, setPuzzle] = useState("");
  const [solution, setSolution] = useState("");
  const [board, setBoard] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [errorCells, setErrorCells] = useState(new Set());
  const [selectedCell, setSelectedCell] = useState(null);
  const [lastAttempts, setLastAttempts] = useState([]);
  const [solvedStatus, setSolvedStatus] = useState("none");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  const persistState = () => {
    try {
      localStorage.setItem(
        "sudoku-state",
        JSON.stringify({
          difficulty,
          puzzle,
          solution,
          board,
          fixed,
          seconds,
          running,
          showSolution,
          solvedStatus,
          lastAttempts,
        })
      );
    } catch {}
  };

  useEffect(() => {
    const storedRaw = localStorage.getItem("sudoku-state");
    let stored = null;
    try {
      stored = JSON.parse(storedRaw);
    } catch {}

    if (stored) {
      if (stored.solvedStatus === "successful") {
        generate(stored.difficulty || "easy");
      } else {
        setDifficulty(stored.difficulty || "easy");
        setPuzzle(stored.puzzle || "");
        setSolution(stored.solution || "");
        setBoard(stored.board || []);
        setFixed(stored.fixed || []);
        setSeconds(stored.seconds || 0);
        setRunning(true);
        setShowSolution(stored.showSolution || false);
        setSolvedStatus(stored.solvedStatus || "none");
        setLastAttempts(stored.lastAttempts || []);
      }
    } else {
      generate("easy");
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const generate = (diff) => {
    const { puzzle: p, solution: s } = getSudoku(diff);
    setPuzzle(p);
    setSolution(s);
    const arr = textTo2dArray(p);
    setBoard(arr);
    setFixed(arr.map((row) => row.map((c) => c !== "")));
    setErrorCells(new Set());
    setShowSolution(false);
    setSolvedStatus("none");
    setSelectedCell(null);
    setSeconds(0);
    setRunning(true);
    setTimeout(persistState, 0);
  };

  const handleDifficultyChange = (e) => {
    const newDiff = e.target.value;
    setDialogAction(() => () => {
      setDifficulty(newDiff);
      generate(newDiff);
    });
    setDialogOpen(true);
  };

  const giveHint = () => {
    const solArr = textTo2dArray(solution);
    const emptyCells = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === "") {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];

    const newBoard = board.map((row, i) => (i === r ? [...row] : [...row]));
    newBoard[r][c] = solArr[r][c];
    setBoard(newBoard);
    setTimeout(persistState, 0);
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setSolvedStatus("failed");
    setRunning(false);
    persistState();
  };

  const handleCellChange = (r, c, val) => {
    const newBoard = board.map((row, i) => (i === r ? [...row] : [...row]));
    newBoard[r][c] = val;
    setBoard(newBoard);

    const errors = new Set();
    for (let rr = 0; rr < 9; rr++) {
      for (let cc = 0; cc < 9; cc++) {
        const v = newBoard[rr][cc];
        if (v && !isValidMove(newBoard, rr, cc, v)) {
          errors.add(`${rr},${cc}`);
        }
      }
    }
    setErrorCells(errors);
    setTimeout(persistState, 0);
  };

  useEffect(() => {
    const solved = board.length === 9 && board.every((row) => row.every((v) => v !== "")) && errorCells.size === 0;
    if (solved && solvedStatus === "none" && !showSolution && seconds > 0) {
      setSolvedStatus("successful");
      setRunning(false);
      const newAttempt = {
        board: board.map((row) => [...row]),
        time: seconds,
        timestamp: Date.now(),
      };
      setLastAttempts((prev) => {
        const upd = [newAttempt, ...prev];
        upd.sort((a, b) => a.time - b.time);
        return upd.slice(0, 5);
      });
      setTimeout(persistState, 0);
    }
  }, [board, errorCells, seconds, solvedStatus, showSolution]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogAction(null);
  };
  const handleDialogConfirm = () => {
    if (dialogAction) dialogAction();
    handleDialogClose();
  };

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Sudoku
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Select value={difficulty} onChange={handleDifficultyChange} sx={{ minWidth: 120 }}>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>

        <ButtonGroup variant="contained">
          <Button
            color="primary"
            onClick={() => {
              setDialogAction(() => () => generate(difficulty));
              setDialogOpen(true);
            }}
          >
            New Puzzle
          </Button>

          <IconButton color="primary" onClick={giveHint} title="Hint">
            <LightbulbIcon />
          </IconButton>

          <Button color="secondary" onClick={handleShowSolution} disabled={showSolution}>
            {showSolution ? "Hide Solution" : "Show Solution"}
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3} sx={{ mt: 3, justifyContent: "center" }}>
        <Grid item xs={12} md={8}>
          <SudokuBoard
            board={board}
            fixed={fixed}
            onCellChange={handleCellChange}
            showSolution={showSolution}
            solution={textTo2dArray(solution)}
            errorCells={errorCells}
            selectedCell={selectedCell}
            onCellFocus={(r, c) => setSelectedCell({ row: r, col: c })}
            editable={solvedStatus === "none" && !showSolution}
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">
              Timer: {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </Typography>

            {solvedStatus === "successful" && (
              <Typography variant="h6" sx={{ color: "green", mt: 2 }}>{`Solved in ${String(
                Math.floor(seconds / 60)
              ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`}</Typography>
            )}
          </Box>

          <Box sx={{ bgcolor: "#f5f5f5", p: 2, mt: 3, overflowY: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Last successful attempts
            </Typography>
            {lastAttempts.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No completed puzzles yet.
              </Typography>
            )}
            {lastAttempts.map((att, idx) => (
              <Box
                key={idx}
                sx={{ mb: 1, p: 1, bgcolor: "#fff" }}
              >
                <Typography variant="caption" display="block">
                  Attempt #{idx + 1}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {new Date(att.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Time: {att.time}s
                </Typography>
                <SudokuBoard
                  board={att.board}
                  fixed={att.board.map((row) => row.map(() => true))}
                  onCellChange={() => {}}
                  showSolution={true}
                  solution={att.board}
                  errorCells={new Set()}
                  editable={false}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography>Changing the puzzle will discard the current game.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button color="primary" onClick={handleDialogConfirm}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
