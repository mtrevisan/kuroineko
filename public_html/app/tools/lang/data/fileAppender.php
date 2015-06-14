<?php
	class FileManager{

		public static function openForAppend($filename){
			if(file_exists($filename) && !is_writable($filename))
				die('Please chmod 777 to folder');

			$file = fopen($filename, 'a') or die('Can\'t create ' . $filename . '!');

			chmod($filename, 0777);

			return $file;
		}

		public static function close($file){
			fclose($file);
		}

		public static function append($file, $text){
			fwrite($file, $text . PHP_EOL);
		}

	}

	$filename = $_POST['filename'];
	$payload = $_POST['payload'];

	$file = FileManager::openForAppend($filename);
	FileManager::append($file, $payload);
	FileManager::close($file);

	$to = "mauro.trevisan@gmail.com";
	$subject = "New dialect inquire";
	$headers = "From: parnodexmentegar <mauro.trevisan@gmail.com>\r\nReply-To: no-reply@gmail.com";
	//$headers = "content-type: multipart/mixed; boundary=\"PHP-mixed-" . md5(date('r', time())) . "\"";
	//$attachment = chunk_split(base64_encode(file_get_contents($filename)));
	mail($to, $subject, $payload, $headers);
?>
