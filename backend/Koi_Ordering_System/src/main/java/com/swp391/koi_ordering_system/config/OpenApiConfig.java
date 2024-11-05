package com.swp391.koi_ordering_system.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.RequestBody;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Fish Ordering System API")
                        .version("1.0")
                        .description("API documentation for the Fish Ordering System"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT"))
                        .addRequestBodies("uploadImageRequestBody",
                                new RequestBody().content(new Content()
                                        .addMediaType("multipart/form-data",
                                                new MediaType().schema(new Schema<>()
                                                        .type("object")
                                                        .addProperty("file", new Schema<>()
                                                                .type("string")
                                                                .format("binary")
                                                                .description("The image file to upload"))))))
                )
                .path("/media/{entity}/{id}/upload/image", new PathItem().post(new Operation()
                        .summary("Upload an image for a specific entity ( farm, account, fish, fishpack )")
                        .addTagsItem("media-controller")
                        .addParametersItem(new Parameter().name("entity").in("path").required(true).schema(new Schema<String>().type("string")))
                        .addParametersItem(new Parameter().name("id").in("path").required(true).schema(new Schema<String>().type("string")))
                        .requestBody(new RequestBody().$ref("#/components/requestBodies/uploadImageRequestBody"))
                        .responses(new ApiResponses().addApiResponse("200", new ApiResponse().description("Image uploaded successfully")))));
    }
}