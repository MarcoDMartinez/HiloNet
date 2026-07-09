package mx.edu.utez.proyectotextil.Servlets;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import  jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mx.edu.utez.proyectotextil.Controllers.LoginController;

import java.io.IOException;

@WebServlet(name = "PaginaLogin", value = "/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        LoginController Usuario = new LoginController(username, password);

        req.setAttribute("usuario", Usuario);
        req.getRequestDispatcher("/WEB-INF/views/Login.jsp").forward(req, resp);
    }
}
