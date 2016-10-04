# metropolia-logger


$.ajax(
	{
		url : "/postlog",
		type : "POST",
		data : {
			log : JSON.stringify(
				{
					token : "4cc44d40-8a0d-11e6-85b0-370c329a8332",
					severity : "info",
					message : {p : 2, mmd : 8.3423, b: "RandomShit"}
				}
			)
		}
	}
)
