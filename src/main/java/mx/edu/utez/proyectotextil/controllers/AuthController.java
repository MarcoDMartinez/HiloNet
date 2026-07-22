package mx.edu.utez.proyectotextil.controllers;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "authController", urlPatterns = {"/login", "/recuperar"})
public class AuthController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        
        if (path.endsWith("/login")) {
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        } else if (path.endsWith("/recuperar")) {
            request.getRequestDispatcher("/WEB-INF/views/recuperar-contrasena.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
