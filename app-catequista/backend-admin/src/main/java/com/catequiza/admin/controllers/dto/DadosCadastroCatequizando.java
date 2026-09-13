package com.catequiza.admin.controllers.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosCadastroCatequizando(
        @NotBlank String cpf,
        @NotBlank String nome,
        String telefone,
        @Email String email
) {
}
