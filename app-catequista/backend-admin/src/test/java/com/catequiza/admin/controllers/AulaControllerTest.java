package com.catequiza.admin.controllers;

import com.catequiza.admin.domain.Turma;
import com.catequiza.admin.repositories.AulaRepository;
import com.catequiza.admin.repositories.CatequistaRepository;
import com.catequiza.admin.repositories.TurmaRepository;
import com.catequiza.admin.security.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AulaController.class)
@AutoConfigureMockMvc(addFilters = false)
class AulaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AulaRepository aulaRepository;

    @MockBean
    private TurmaRepository turmaRepository;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private CatequistaRepository catequistaRepository;

    @Test
    void cadastrarAulaDeveRetornar201() throws Exception {
        Turma turma = new Turma();
        turma.setId(1L);
        turma.setNomeTurma("Turma Batismo");

        when(turmaRepository.findById(anyLong())).thenReturn(Optional.of(turma));

        String dadosCadastro = """
                {
                    "idTurma": 1,
                    "data": "2024-09-15",
                    "descricaoConteudo": "Aula sobre Batismo"
                }
                """;

        mockMvc.perform(post("/aulas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosCadastro))
                .andExpect(status().isCreated());
    }

    @Test
    void listarAulasDeveRetornar200() throws Exception {
        mockMvc.perform(get("/aulas"))
                .andExpect(status().isOk());
    }
}