$(document).ready((() => {
	let images = [];
	let image = "";
	let text = "";
	let interval = 100;
	let count = 0;
	let permanent = false;
	let qrCodeChecks = 0;

	let ims = document.getElementById("ims");
	let fzi = document.getElementById("fzi");
	let hs = document.getElementById("hs");
	const logos = [ims, fzi, hs];
		
	images[0] = ['images/ims-chips.png'];
	images[1] = ['images/fzi.png'];
	images[2] = ['images/hahn-schickard.png'];
	let index = 0;
	
	/*function logo(id, show){
		for (let i = 0; i < 3; i++) {
			if (i == id) {
				logos[i].style.display = (show) ? "null" : "none";
				break;
			}
		logos[i].style.display = (show) ? "none" : "null";
	}*/
	
	function showLogo(id){
		for (let i = 0; i < 3; i++) {
			if (i == id) {
				logos[i].style.display = "null";
				break;
			}
		logos[i].style.display = "none";
	}
	
	function fzi(){
		
	}
	
	function ims(){
		
	}
	
	function

	function change() {
		console.log(Date.now());
		//getEvent();
		
		if(image === "" && text !== ""){
			$("#text").css("padding-top", "400px");
		} else {
			$("#text").css("padding-top", "0px");
		}
		
		if ((image !== "" || text !== "") && interval > 0) {
			logo(index);
			$('#text').html(text);
		} else {
			//interval = 100;
			count++;
			if(count == 1) {
				logo(index)
			} else if (count == 50) {
				
				$('#text').html("");
		if (index == 2) {
			index = 0;
		} else {
			index++;
		}
			console.log("Index: " + index);	
				count = 0;
			} else {
				
			}
			

	}
		console.log(count);
	setTimeout(change, interval);
	}

	window.onload = change();
	
	
	function getEvent() {
		fetch('api/event.php', {
                method: 'get',
                headers: { 'content-type': 'application/json' }
            })
		.then((response) => response.json())
		.then(function(data) {
			
			if(data.error === false){
				
				if(qrCodeChecks > 0){
					if(data.text == "Invoice opened"){
						qrCodeChecks = 0;
						interval = data.duration;
					} else {
						qrCodeChecks--;
						if(qrCodeChecks == 0){
							interval = 1000;
						}
					}
				} else {
				
					if ((data.image !== "" || data.text !== "") && data.duration < 0) {
						permanent = true;
					
						interval = 1000;
						image = data.image;
						text = data.text;
					
					} else if (data.image === "" && data.text === "" && data.duration < 0) {
						permanent = false;
					
						image = "";
						text = "";
					}
				
					if(!permanent){
					
						if((data.image).includes("qrcode.php")){
							qrCodeChecks = data.duration / 100;
							interval = 100;
						} else {
							interval = data.duration;
						}
						image = data.image;
						text = data.text;
					}
				}
				
				
			} else {
				text = "Unknown error";
				interval = 5000;
			}
		})
		.catch(function(error) {
			console.log(error);
		});
	}	
}))
