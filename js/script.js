$(document).ready((() => {

    let text = "";
    let imageName = "";
    let interval = 100;
    let permanent = false;
    let activeEvent = false;
    let checks = 0;
	let queue = [];

    let logosVisible = true;

    let logos = document.getElementById("logos");
    let image = document.getElementById("image");

    function showLogos() {
        if (logos.style.display === "none") {
            image.style.display = "none";
            logos.style.display = null;
        }
        $('#text').html("");
    }

    function showImage(name) {
        logos.style.display = "none";
        if (name !== "") {
            image.setAttribute("src", name);
            image.style.display = null;
        } else {
            image.style.display = "none";
        }
    }

    function hideAll() {
        logos.style.display = "none";
        image.style.display = "none";
        $('#text').html("");
    }

    function change() {
        getEvent();

        if (image.getAttribute("src") === null && text !== "") {
            $("#text").css("padding-top", "400px");
        } else {
            $("#text").css("padding-top", "0px");
        }

		console.log("Active event: ");
		console.log(activeEvent);
        if (!activeEvent) {
            showLogos();
        } else {
			if(imageName !== image.getAttribute("src")) {
				 showImage(imageName);
			}
           
			if(text !== $('#text').html()) {
				 $('#text').html(text);
			}
            
        }

        setTimeout(change, interval);
    }

    window.onload = change();


    function getEvent() {
		console.log(Date.now());
		console.log(queue);
		console.log(checks);
        fetch('api/event.php', {
                method: 'get',
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then(function(data) {

                if (data.error === false) {
					
					if (queue.length > 0 && checks == 0) {
						console.log("queue not empty");
						data.image = queue[0].image;
						data.text = queue[0].text;
						data.duration = queue[0].duration;
						queue.shift();
					}
					
                    if (data.duration > 0) {

						if (checks == 0) {
							
							if (data.image !== "") {
								imageName = data.image;
							}
							text = data.text;
							
							activeEvent = true;
							checks = data.duration / interval;
							
						} else {
							if (data.image != "" || data.text != "") {
								queue.push({"text": data.text, "image": data.image, "duration": data.duration});
								console.log(queue);
							}
						}
                      
                        if (data.text === "Invoice opened") {
                            //data.text = "";
                            checks = 20;
                        }

                    } else if (data.duration < 0) {
                        activeEvent = true;
                        checks = 0;
                        if (data.image !== "" || data.text !== "") {
                            permanent = true;

                            imageName = data.image
                            text = data.text;

                        } else if (data.image === "" && data.text === "") {
                            permanent = false;
                            imageName = "";
                            text = "";
                        }

                    } else {
                        if (checks > 0) {
                            checks--;

                        } else if (activeEvent) {
                            activeEvent = false;
                            hideAll();
                        }

                    }


                } else {
                    checks = 30;
                    text = "Unknown error";
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}))