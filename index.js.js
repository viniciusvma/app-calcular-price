const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const getDolarValue = async () => {
  try {
    const response = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    return parseFloat(response.data.USDBRL.ask); 
  } catch (error) {
    console.error('Erro ao obter a cotação do dólar:', error.message);
    throw new Error('Não foi possível obter a cotação do dólar.');
  }
};

app.get('/dolar', async (req, res) => {
  try {
    const valorDolar = await getDolarValue();
    res.json({ dolar: valorDolar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/calculate', async (req, res) => {
  const { tonelada } = req.body;

  if (!tonelada) {
    return res.status(400).json({ error: 'Tonelada é obrigatória.' });
  }

  try {
    const valorDolar = await getDolarValue();
    const valorFixo = 1.415;
    const valorFixo2 = 0.0425;
    const valorTonelada = tonelada; 

    const calculo1 = valorTonelada * valorFixo;      
    const calculo2 = calculo1 * valorDolar;         
    const calculo3 = calculo2 * valorFixo2;         
    const calculo4 = calculo2 - calculo3;           

    const totalKg = (calculo4 + 80.0) / 1000;      

    res.json({ totalKg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
