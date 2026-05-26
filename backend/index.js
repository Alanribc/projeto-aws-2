require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});



app.get('/', (req, res) => {
    res.json({
        mensagem: 'API funcionando'
    });
});


app.get('/items', async (req, res) => {
    console.log('Rota /items chamada')
    try{
        const result = await pool.query('SELECT * FROM items');

        res.json(result.rows);
    } catch(error) {
        console.error(error);
        
        
        res.status(500).json({
            erro: 'Erro ao buscar items'
        });
    }
});

app.post('/items', async (req, res) => {
    try{
        const {nome} = req.body;

        const result = await pool.query(
            'INSERT INTO items (nome) VALUES ($1) RETURNING *',
            [nome]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao criar item'
        });
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        const result = await pool.query(
            'UPDATE items SET nome = $1 WHERE id = $2 RETURNING *',
            [nome, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar item'
        });
    }
});

app.delete('/items/:id', async (req, res) => {
    try{
        const { id } = req.params;

        await pool.query(
            'DELETE FROM items WHERE id = $1',
            [id]
        );

        res.json({
            mensagem: 'Item deletado com sucesso'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: 'Erro ao deletar item'
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000')
});