import { Button, Container, Typography, Grid, ButtonGroup  } from "@mui/material";
import { getSudoku } from 'sudoku-gen';
import { useState } from 'react';

function TextTo2dArray(text) {
  const arr = text.split('');
  const rows = [];
  for (let i = 0; i < 9; i++) {
    var temp = [];
    for (let j = 0; j < 9; j++) { 
      var p = arr[i*9 + j];
      if(p === '-') p = '';
      temp.push(p);
    }
    rows.push(temp);
    temp = [];
  }
  return rows;
}

function previewSudoku(rows) {
  const sudokuUi = rows.map((row, rowIndex) => ( 
    <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center' }}>  
      {row.map((cell, cellIndex) => (
        <div key={cellIndex} style={{
          width: '40px',
          height: '40px',
          border: '1px solid black',  
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', 
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: cell === '' ? '#ffffffff' : '#dddddd70'
        }}>
          {cell === '' ? '' : cell}  
        </div>
      ))}
    </div>
  ));
  return sudokuUi;
}


function Game( {sText, type} ) {
  if(type === 'solution') {
    var rows = TextTo2dArray(sText.solution);
  } else {
    var rows = TextTo2dArray(sText.puzzle);
  }  
  const sudokuUi = previewSudoku(rows);

  return (
    <div >
      {sudokuUi}  
    </div>

  );
}


export default function Sudoku() {
  const [index, setIndex] = useState(0);
  function handleClick() {
    setIndex(index + 1);
  }
  const s = getSudoku('easy');
  

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" gutterBottom>
        Sudoku
      </Typography>
      <Button sx={{ mt: 3 }} variant="contained" onClick={handleClick} >Generate New Sudoku
      </Button>
      <Grid marginTop="20px" variant="body1" color="text.secondary" container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={6}>
          <Game sText={s} type="" />
        </Grid>
        <Grid size={6}>
          <Game sText={s} type="solution" />
        </Grid>
        
      </Grid>
    </Container>
  );
}