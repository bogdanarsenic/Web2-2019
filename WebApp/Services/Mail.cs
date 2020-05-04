using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace WebApp.Services
{
    public class Mail : IMail
    {
        public void SendMail(string subject, string body, string emailTo)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            mail.To.Add(emailTo);
            mail.Subject = subject;
            mail.Body = body;
            mail.From = new MailAddress("bogdanarsenic@gmail.com");
            SmtpServer.Port = 587;
            SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.Credentials = new System.Net.NetworkCredential("bogdanarsenic@gmail.com", "bogdanbre");
            SmtpServer.EnableSsl = true;
            SmtpServer.Send(mail);
        }
    }
}