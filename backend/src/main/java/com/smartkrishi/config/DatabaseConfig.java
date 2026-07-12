package com.smartkrishi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String defaultUrl;

    @Value("${spring.datasource.username:}")
    private String defaultUsername;

    @Value("${spring.datasource.password:}")
    private String defaultPassword;

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String defaultDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        String dbUrl = null;
        if (!"local".equals(activeProfile)) {
            dbUrl = System.getenv("DATABASE_URL");
            if (dbUrl == null) {
                dbUrl = System.getProperty("DATABASE_URL");
            }
        }
        if (dbUrl != null && (dbUrl.startsWith("mysql://") || dbUrl.startsWith("postgres://"))) {
            try {
                URI dbUri = new URI(dbUrl);
                String userInfo = dbUri.getUserInfo();
                String username = "";
                String password = "";
                if (userInfo != null && userInfo.contains(":")) {
                    String[] userParts = userInfo.split(":", 2);
                    username = userParts[0];
                    password = userParts[1];
                }

                String dbType = dbUri.getScheme();
                String host = dbUri.getHost();
                int port = dbUri.getPort();
                String path = dbUri.getPath();

                if (port == -1) {
                    port = dbType.equals("mysql") ? 3306 : 5432;
                }

                String jdbcUrl;
                String driverClassName;
                if (dbType.equals("mysql")) {
                    jdbcUrl = "jdbc:mysql://" + host + ":" + port + path
                            + "?useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true";
                    driverClassName = "com.mysql.cj.jdbc.Driver";
                } else {
                    jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require";
                    driverClassName = "org.postgresql.Driver";
                }

                return DataSourceBuilder.create()
                        .url(jdbcUrl)
                        .username(username)
                        .password(password)
                        .driverClassName(driverClassName)
                        .build();
            } catch (URISyntaxException e) {
                // fall back to default properties on parsing error
            }
        }

        return DataSourceBuilder.create()
                .url(defaultUrl)
                .username(defaultUsername)
                .password(defaultPassword)
                .driverClassName(defaultDriver)
                .build();
    }
}
