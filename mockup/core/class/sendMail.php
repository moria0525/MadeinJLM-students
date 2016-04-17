<?php
class sendMail {
    public static function send($to, $subject, $message) {
        
        $headers = "From: " . strip_tags('barak@thinksmart.co.il') . "\r\n";
        $headers .= "Reply-To: ". strip_tags('barak@thinksmart.co.il') . "\r\n";
        // $headers .= "CC: susan@example.com\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        
        $html = '
        <!DOCTYPE html>
        <html>
            <head>
                <title>' . $subject . '</title>
            </head>
            <body style="margin: 0;padding:0;background-color:#EFF3F8;">
                <div style="background-color:#EFF3F8;padding: 60px 0;">
                    <div style="max-width:680px; background-color:white; border-radius:2px; margin:auto; font-family: arial;  font-weight: 100;">
                        <div style="width:100%;">
                            <a href="http://www.thinksmart.co.il/">JLM</a>
                        </div>
                        <div style="padding: 45px 30px;background-color:rgb(251, 251, 251);" dir="LTR">
                            <h1 style="  font-size: 1.8em;color: #002b5b;margin: 0;font-weight: 100;">' . $subject . '</h1>
                            <p>' . $message . '</p>
                        </div>
                        <div style="width:100%;text-align:center;  padding: 45px 0;  color: darkgray;">
                            JLM jobs © 2015 
                        </div>

                    </div>
                </div>
            </body>
        </html>
        ';
        
        mail($to, $subject, $html, $headers);
    }
}
