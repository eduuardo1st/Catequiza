package com.catequiza.admin.controllers;

import com.catequiza.admin.domain.Catequista;
import com.catequiza.admin.repositories.CatequistaRepository;
import com.catequiza.admin.security.TokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private CatequistaRepository catequistaRepository;

    @Test
    void loginComCredenciaisValidasDeveRetornar200() throws Exception {
        String dadosLogin = """
                {
                    "email": "admin@teste.com",
                    "senha": "123456"
                }
                """;

        Catequista catequista = new Catequista();
        catequista.setEmail("admin@teste.com");

        Authentication authentication = new UsernamePasswordAuthenticationToken(catequista, null);

        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
        when(tokenService.gerarToken(anyString())).thenReturn("token-jwt-teste");

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(dadosLogin))
                .andExpect(status().isOk());
    }
}