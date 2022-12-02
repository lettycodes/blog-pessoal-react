import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Postagem from '../../../models/Postagem';
import { busca } from '../../../services/Service'
import { Card, CardActions, CardContent, Button, Typography } from '@material-ui/core';
import './ListaPostagem.css';
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import { toast } from 'react-toastify';

function ListaPostagem() {

    const [posts, setPosts] = useState<Postagem[]>([])
    let navigate = useNavigate();

    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );

    useEffect(() => {
        if(token == ''){
            toast.error('Você precisa estar logado!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined
            });
            navigate("/login");
        }
    }, [token])

    async function getPost() {
        await busca("/postagens", setPosts, {
            headers: {
                'Authorization': token
            }
        })
    }

    useEffect(() => {
        getPost()
    }, [posts.length])

return (
    <>
    <div className='containerLista'>
    {
        posts.map(post => (
        <Box alignSelf='flex-start'>
            <Card variant="outlined" className='postagens'>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    Postagens
                </Typography>
                <Typography variant="h5" component="h2">
                    {post.titulo}
                </Typography>
                <Typography variant="body2" component="p">
                    {post.texto}
                </Typography>

                <Typography variant="body2" component="p">
                    {/* Mostrar apenas data:  */}
                    {new Date(Date.parse(post.data)).toLocaleDateString()} <br />
                    {/* Mostar data e hora: {new Date(Date.parse(post.data)).toLocaleString()} <br /> */}
                    {/* Mostrar apenas hora: {new Date(Date.parse(postagem.data)).toLocaleTimeString()} */}
            </Typography>

                <Typography variant="body2" component="p">
                    {post.tema?.descricao}
                </Typography>
            </CardContent>
            <CardActions>
                <Box display="flex" justifyContent="center" mb={1.5}>
                <Link to={`/formularioPostagem/${post.id}`} className="text-decorator-none" >
                    <Box mx={1}>
                    <Button variant="contained" size='small' color="primary" className="botao-atualizar">
                        atualizar
                    </Button>
                    </Box>
                </Link>
                <Link to={`/deletarPostagem/${post.id}`} className="text-decorator-none">
                    <Box mx={1}>
                    <Button variant="contained" size='small' color="secondary">
                        deletar
                    </Button>
                    </Box>
                </Link>
                </Box>
            </CardActions>
            </Card>
    </Box>
        ))
    }
    </div>
    </>
    )
}

export default ListaPostagem;