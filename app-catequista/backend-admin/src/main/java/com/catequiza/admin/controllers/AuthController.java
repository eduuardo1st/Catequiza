package com.catequiza.admin.controllers;

import com.catequiza.admin.controllers.dto.DadosLogin;
import com.catequiza.admin.controllers.dto.DadosTokenJWT;
import com.catequiza.admin.security.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<DadosTokenJWT> login(@RequestBody DadosLogin dadosLogin) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                dadosLogin.email(), dadosLogin.senha());
        var authentication = authenticationManager.authenticate(authenticationToken);
        String tokenJWT = tokenService.gerarToken(((com.catequiza.admin.domain.Catequista) authentication.getPrincipal()).getEmail());
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
    }
}
