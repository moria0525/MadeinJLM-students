<?php

 /*
  *
  * sendMail Class
  * Using mail function to send mails
  * @param $message for the message itself
  * @param $subject for the subject of the mail
  * @param $html get all the html code
  * @param $to is the sender's adress
  *
  */


class sendMail {
    public static function send($to, $subject, $message) {
        
        $headers = "From: " . strip_tags('madeinjlm.jce@gmail.com') . "\r\n";
        $headers .= "Reply-To: ". strip_tags('madeinjlm.jce@gmail.com') . "\r\n";
        // $headers .= "CC: susan@example.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        
        $html = '
        <!DOCTYPE html>
        <html>
            <head>
                <title>' . $subject . '</title>
            </head>
            <body style="margin: 0;padding:0;">
				<div style="background-color:#192944;margin:auto;font-family: Calibri;font-weight: 100;max-width: 600px;">
					<div>
						<a href="http://job.madeinjlm.org">
							<img src="https://raw.githubusercontent.com/moria0525/MadeinJLM-students/master/logo.png" style="width:100%;display: block;">
						</a>
					</div>
					<div style="padding: 45px 30px;background-color:#f4f8ff;" dir="LTR">
						<h1 style="font-size: 2.8em;color: #192944;margin: 0;font-weight: 100;">' . $subject . '</h1>
						<div style="font-size: 1.8em;color: #192944;">' . $message . '</div>
					</div>
					<div style="width:100%;text-align:center;padding: 45px 0;color: #FFF;font-size: 20px;">
						madeinJLM jobs © 2016 
					</div>
				</div>
            </body>
        </html>
        ';
        
        mail($to, $subject, $html, $headers);
    }
}
