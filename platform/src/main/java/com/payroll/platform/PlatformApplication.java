package com.payroll.platform;

import com.payroll.platform.model.User;
import com.payroll.platform.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(
				PlatformApplication.class,
				args
		);
	}

	@Bean
	CommandLineRunner initializeUsers(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder
	) {
		return args -> {

			String password = "admin123";

			createOrUpdateUser(
					userRepository,
					passwordEncoder,
					"dhruv@techcorp.com",
					"ROLE_COMPANY_ADMIN",
					1L,
					password
			);

			createOrUpdateUser(
					userRepository,
					passwordEncoder,
					"auditor@techcorp.com",
					"ROLE_AUDITOR",
					1L,
					password
			);

			createOrUpdateUser(
					userRepository,
					passwordEncoder,
					"employee@techcorp.com",
					"ROLE_EMPLOYEE",
					1L,
					password
			);

			createOrUpdateUser(
					userRepository,
					passwordEncoder,
					"superadmin@quillcrest.com",
					"ROLE_SUPER_ADMIN",
					null,
					password
			);
		};
	}

	private void createOrUpdateUser(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			String email,
			String role,
			Long companyId,
			String password
	) {

		User user = userRepository
				.findByEmail(email)
				.orElseGet(() -> new User(
						email,
						passwordEncoder.encode(password),
						role
				));

		user.setRole(role);
		user.setCompanyId(companyId);

		if (!passwordEncoder.matches(
				password,
				user.getPassword()
		)) {
			user.setPassword(
					passwordEncoder.encode(password)
			);
		}

		userRepository.save(user);

		System.out.println(
				"USER READY: "
						+ email
						+ " | "
						+ role
						+ " | company="
						+ companyId
		);
	}
}