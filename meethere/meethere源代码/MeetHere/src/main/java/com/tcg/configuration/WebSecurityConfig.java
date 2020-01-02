package com.tcg.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.tcg.service.impl.MyUserDetailsServiceImpl;

/**
 * 
 * @author tcg
 *
 */

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled=true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter 
{
	@Override
	protected void configure(HttpSecurity http) throws Exception
	{
		http
			.csrf()
				.disable()
			.authorizeRequests()
				.antMatchers("/css/**", "/js/**","/images/**").permitAll()
				.antMatchers("/public/**","/system/**","/").permitAll()
				.antMatchers("/user/**").hasAnyRole("USER","ADMIN")
				.antMatchers("/admin/**").hasRole("ADMIN")
				.anyRequest().authenticated()
				.and()
			.formLogin()
				.loginPage("/public/login")
				.defaultSuccessUrl("/public/login?success",true)
				.permitAll()
				.and()
			.logout()
				.permitAll();
	}
	 

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception 
//    {
//        auth.inMemoryAuthentication()
//                .passwordEncoder(new BCryptPasswordEncoder())
//                .withUser("user")
//                .password(new BCryptPasswordEncoder().encode("123456"))
//                .roles("USER");
//    }
	
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception
	{
		auth.userDetailsService(detailsServiceImpl()).passwordEncoder(passwordEncoder());
	}

	@Bean
	public MyUserDetailsServiceImpl detailsServiceImpl()
	{
		return new MyUserDetailsServiceImpl();
	}
	
	@Bean
	public BCryptPasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}
}
