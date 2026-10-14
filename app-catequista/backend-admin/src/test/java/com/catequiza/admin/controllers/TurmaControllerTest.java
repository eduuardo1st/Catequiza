package com.catequiza.admin.controllers;

import com.catequiza.admin.repositories.*;
import com.catequiza.admin.domain.*;
import com.catequiza.admin.controllers.dto.*;
import com.catequiza.admin.security.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TurmaController.class)
@AutoConfigureMockMvc(addFilters = false)
class TurmaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TurmaRepository turmaRepository;

    @MockBean
    private CatequistaRepository catequistaRepository;

    @MockBean
    private TokenService tokenService;

    @Test
    void cadastrarTurmaDeveRetornar201() throws Exception {
        var catequista = new Catequista();
        catequista.setId(1L);
        catequista.setNome("Catequista Teste");

        when(catequistaRepository.findById(anyLong())).thenReturn(Optional.of(catequista));

        var dadosCadastro = """
                {
                    "idCatequista": 1,
                    "nomeTurma": "Turma Batismo 2024",
                    "anoLetivo": 2024
                }
                """;

        mockMvc.perform(post("/turmas")
                        .contentType("application/json")
                        .content(dadosCadastro))
                .andExpect(status().isCreated());
    }

    @Test
    void listarTurmasDeveRetornar200() throws Exception {
        mockMvc.perform(get("/turmas"))
                .andExpect(status().isOk());
    }
}
