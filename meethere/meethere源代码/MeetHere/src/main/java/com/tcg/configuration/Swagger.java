package com.tcg.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * 
 * @author tcg
 *
 */

@Configuration
@EnableSwagger2
public class Swagger
{

	@Bean
	public Docket docket()
	{
		return new Docket(DocumentationType.SWAGGER_2)
				   .apiInfo(apiInfo())
				   .select()
				   .apis(RequestHandlerSelectors.basePackage("com.tcg.controller"))
				   .paths(PathSelectors.any()).build();
	}

	public ApiInfo apiInfo()
	{
		return new ApiInfoBuilder()
				   .title("MeetHere API文档")
				   .description("返回结果均为字符串，需要数据的均为JsonString，其余成功为success，失败为fail\n"
						        + "传入参数约定：所有传入时间需为格式为yyyy-MM-dd HH:MM:SS的字符串")
				   .termsOfServiceUrl("")
				   .version("1.0")
				   .build();
	}
}