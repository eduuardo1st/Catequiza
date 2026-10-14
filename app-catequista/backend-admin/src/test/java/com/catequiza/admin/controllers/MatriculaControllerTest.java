package com.catequiza.admin.controllers;

import com.catequiza.admin.domain.Catequizando;
import com.catequiza.admin.domain.Turma;
import com.catequiza.admin.repositories.CatequistaRepository;
import com.catequiza.admin.repositories.CatequizandoRepository;
import com.catequiza.admin.repositories.MatriculaTurmaRepository;
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

@WebMvcTest(MatriculaController.class)
@AutoConfigureMockMvc(addFilters = false)
class MatriculaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MatriculaTurmaRepository matriculaTurmaRepository;

    @MockBean
    private CatequizandoRepository catequizandoRepository;

    @MockBean
    private TurmaRepository turmaRepository;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private CatequistaRepository catequistaRepository;

    @Test
    void cadastrarMatriculaDeveRetornar201() throws Exception {
        Catequizando catequizando = new Catequizando();
        catequizando.setMatricula(1L);
        catequizando.setNome("João Silva");

        Turma turma = new Turma();
        turma.setId(1L);
        turma.setNomeTurma("Turma Batismo");

        when(catequizandoRepository.findById(anyLong())).thenReturn(Optional.of(catequizando));
        when(turmaRepository.findById(anyLong())).thenReturn(Optional.of(turma));

        String dadosCadastro = """
                {
                    "matriculaCatequizando": 1,
                    "idTurma": 1,
                    "statusMatricula": "ATIVA"
                }
                """;

        mockMvc.perform(post("/matriculas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosCadastro))
                .andExpect(status().isCreated());
    }

    @Test
    void listarMatriculasDeveRetornar200() throws Exception {
        mockMvc.perform(get("/matriculas"))
                .andExpect(status().isOk());
    }
}