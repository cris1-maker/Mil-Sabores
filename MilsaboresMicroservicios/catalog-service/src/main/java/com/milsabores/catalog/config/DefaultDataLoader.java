package com.milsabores.catalog.config;

import com.milsabores.catalog.catalog.model.Category;
import com.milsabores.catalog.catalog.model.Product;
import com.milsabores.catalog.catalog.repository.CategoryRepository;
import com.milsabores.catalog.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DefaultDataLoader {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Bean
    CommandLineRunner initDefaultData() {
        return args -> {

            // Si ya hay productos, no cargar de nuevo
            if (productRepository.count() > 0) {
                System.out.println("[DefaultDataLoader] Ya existen productos, no se cargan datos por defecto.");
                return;
            }

            System.out.println("[DefaultDataLoader] Cargando productos por defecto...");

            // Crear categorías si no existen
            Category tortas     = getOrCreateCategory("tortas");
            Category cheesecake = getOrCreateCategory("cheesecake");
            Category postres    = getOrCreateCategory("postres");
            Category desayuno   = getOrCreateCategory("desayuno");
            Category galletas   = getOrCreateCategory("galletas");

            // Crear productos por defecto
            List<Product> defaults = List.of(
                build("CHEESE_FRUTOS", "Cheesecake de frutos rojos",
                        "Base suave con mezcla cremosa y frutos rojos.",
                        12990, "/img/cheese.png", cheesecake),

                build("BROWNIE_CLASICO", "Brownie clásico",
                        "Bizcocho húmedo con intenso sabor a chocolate.",
                        2990, "/img/browni.png", postres),

                build("BLONDIE_NUEZ", "Blondie de nuez",
                        "Versión clara del brownie con toque de nueces.",
                        2990, "/img/blondi.png", postres),

                build("CUPCAKE_ZANAH", "Cupcake de zanahoria",
                        "Masa especiada con frosting suave.",
                        2490, "/img/carrot.png", postres),

                build("TORTA_BODA", "Torta de boda",
                        "Torta elegante ideal para celebraciones especiales.",
                        25990, "/img/Boda.png", tortas),

                build("RED_VELVET", "Torta Red Velvet",
                        "Bizcocho rojo aterciopelado con crema suave.",
                        18990, "/img/redvelvet.png", tortas),

                build("TORTA_CREMA", "Torta de crema",
                        "Torta tradicional con crema fresca.",
                        15990, "/img/torta.png", tortas),

                build("PAVLOVA_BERRIES", "Pavlova berries",
                        "Merengue crujiente con crema y frutos del bosque.",
                        13990, "/img/pavlova.png", tortas),

                build("MACARONS_SURT", "Macarons surtidos",
                        "Caja surtida de macarons artesanales.",
                        6990, "/img/macarons.png", galletas),

                build("GALLETAS_MANTEQ", "Galletas de mantequilla",
                        "Clásicas galletas caseras de mantequilla.",
                        3490, "/img/galleta.png", galletas),

                build("ROLL_CANELA", "Roll de canela",
                        "Hojaldre suave con relleno aromático.",
                        2590, "/img/cinnamon.png", desayuno),

                build("CROISSANT_MANT", "Croissant de mantequilla",
                        "Hojaldre ligero, ideal para acompañar el café.",
                        2490, "/img/croasan.png", desayuno),

                build("BAGEL_ARAND", "Bagel de arándanos",
                        "Masa tierna con toques frutales.",
                        2390, "/img/bluebagel.png", desayuno),

                build("SCONE_ARAND", "Scone de arándanos",
                        "Panecillo dulce con trozos de arándano.",
                        2290, "/img/scon_blu.png", desayuno)
            );

            productRepository.saveAll(defaults);

            System.out.println("[DefaultDataLoader] Productos por defecto cargados: " + defaults.size());
        };
    }

    private Category getOrCreateCategory(String name) {
        return categoryRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    return categoryRepository.save(c);
                });
    }

    private Product build(
            String sku,
            String name,
            String desc,
            int price,
            String imageUrl,
            Category category
    ) {
        return Product.builder()
                .sku(sku)
                .name(name)
                .description(desc)
                .price(BigDecimal.valueOf(price))
                .stock(50)
                .imageUrl(imageUrl)
                .active(true)
                .category(category)
                .build();
    }
}
