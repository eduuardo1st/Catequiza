package com.catequiza.aluno;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource; 

@SpringBootTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class CatequizaAlunoApplicationTests {

    @Test
    void contextLoads() {
    }

}