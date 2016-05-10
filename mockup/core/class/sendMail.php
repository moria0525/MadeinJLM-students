<?php
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
            <body style="margin: 0;padding:0;background-color:#FFBF00;">
                <div style="background-color:#EFF3F8;padding: 60px 0;">
                    <div style= "text-align:center;">
                    <img src="https://raw.githubusercontent.com/moria0525/MadeinJLM-students/master/logo.png" align="middle">                    
                    </div>    
                    <div style="max-width:680px; background-color:#F5DA81; border-radius:2px; margin:auto; font-family: Calibri;  font-weight: 100;">
                        <div style="width:100%;">
                            <a href="http://job.madeinjlm.org">madeinJLM Jobs Home-page</a>
                        </div>
                        <div style="padding: 45px 30px;background-color:#F5F6CE;" dir="LTR">
                            <h1 style="  font-size: 2.8em;color: #002b5b;margin: 0;font-weight: 100;">' . $subject . '</h1>
                            <div style=" font-size: 1.8em">' . $message . '</div>
                        </div>
                        <div style="width:100%;text-align:center;  padding: 45px 0;  color: darkgray;">
                            madeinJLM jobs © 2016 
                        </div>

                    </div>
                </div>
            </body>
        </html>
        ';
        
        mail($to, $subject, $html, $headers);
    }
}
