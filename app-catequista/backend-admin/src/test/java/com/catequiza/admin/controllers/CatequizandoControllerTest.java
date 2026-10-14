package com.catequiza.admin.controllers;

import com.catequiza.admin.repositories.CatequistaRepository;
import com.catequiza.admin.repositories.CatequizandoRepository;
import com.catequiza.admin.security.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CatequizandoController.class)
@AutoConfigureMockMvc(addFilters = false)
class CatequizandoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CatequizandoRepository catequizandoRepository;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private CatequistaRepository catequistaRepository;

    @Test
    void cadastrarCatequizandoDeveRetornar201() throws Exception {
        String dadosCadastro = """
                {
                    "cpf": "123.456.789-00",
                    "nome": "João Silva",
                    "telefone": "11999998888",
                    "email": "joao@teste.com"
                }
                """;

        mockMvc.perform(post("/catequizandos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosCadastro))
                .andExpect(status().isCreated());
    }

    @Test
    void listarCatequizandosDeveRetornar200() throws Exception {
        mockMvc.perform(get("/catequizandos"))
                .andExpect(status().isOk());
    }
}