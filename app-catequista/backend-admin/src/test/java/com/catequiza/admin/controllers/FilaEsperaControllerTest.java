package com.catequiza.admin.controllers;

import com.catequiza.admin.repositories.CatequistaRepository;
import com.catequiza.admin.repositories.FilaEsperaRepository;
import com.catequiza.admin.security.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FilaEsperaController.class)
@AutoConfigureMockMvc(addFilters = false)
class FilaEsperaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FilaEsperaRepository filaEsperaRepository;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private CatequistaRepository catequistaRepository;

    @Test
    void listarFilaEsperaDeveRetornar200() throws Exception {
        mockMvc.perform(get("/fila-espera"))
                .andExpect(status().isOk());
    }
}