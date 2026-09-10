package com.catequiza.admin.security;

import com.catequiza.admin.repository.CatequistaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    private final CatequistaRepository catequistaRepository;

    public AutenticacaoService(CatequistaRepository catequistaRepository) {
        this.catequistaRepository = catequistaRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return catequistaRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Catequista nao encontrado: " + username));
    }
}
