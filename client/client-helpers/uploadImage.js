uploadImage = function(file, contentDirectory, typeDirectory, contentId) {
	Session.set('fileUrl', '');
	var reader = new FileReader();
	reader.onload = function(e) {

		Meteor.call('uploadImage', e.target.result, file.name, file.size, file.type, contentDirectory, typeDirectory, contentId, function(error, result) {
			console.log(error);
			console.log(result);
			if (result) {
				Session.set('fileUrl', result.imageName);
				$('.imagePreview').attr('src', result.fileUrl);


				// Update respective document
				// This is a temporary way of doing it for now
				
				if (contentDirectory === "users" && typeDirectory === "avatar")
					Meteor.users.update({_id: Meteor.userId()}, {$set: {avatarImage: file.name}});

				if (contentDirectory === "users" && typeDirectory === "profileBanner")
					Meteor.users.update({_id: Meteor.userId()}, {$set: {profileBannerImage: file.name}});


			}

		});

	}

	if (file) {
		reader.readAsBinaryString(file);
	}
};