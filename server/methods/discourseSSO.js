Meteor.methods({
	discourseSSO: function(payload, sig, user) {
		var sso = new discourse_sso(privateSiteSettings.discourseSSOKey);
		var nonce;
		// We'll just use the current user
		user = Meteor.user();
		// validate sig with payload
		if (sso.validate(payload, sig)) {
			var nonce = sso.getNonce(payload);

			var userParams = {
				"nonce": nonce,
				"external_id": user._id,
				"email": user.emails[0].address, // we just grab the first address
				"username": user.originalUsername,
				"name": (user.profile) ? user.profile.name : '',
				"avatar_url": user.avatarImageUrl(),
				"about_me": (user.profile) ? user.profile.about : '',
			};

			var queryParams = sso.buildLoginString(userParams);
			var returnUrl = "http://community.phanime.com/session/sso_login?" + queryParams;

			return returnUrl;
		}
	},
	//////////////////////////////////////
	//* ---- Logs out current user ----*//
	//////////////////////////////////////
	discourseLogout: function() {
		var user = Meteor.user();

		if (!user) {
			throw new Meteor.Error('user-unavailable', 'User must be logged in to perform this action');
		}

		console.log(Meteor.settings.discourseApiUsername);
		console.log(Meteor.settings.discourseApiKey);

		HTTP.get('http://community.phanime.com/users/by-external/' + user._id + '.json', {
			params: {
				api_username: Meteor.settings.discourseApiUsername,
				api_key: Meteor.settings.discourseApiKey
			}
		}, Meteor.bindEnvironment(function(error, result) {

			var discourseUserId = result.data.user.id;
			console.log(discourseUserId);
			if (discourseUserId) {
				HTTP.post('http://community.phanime.com/admin/users/' + discourseUserId + '/log_out', {
					params: {
						api_username: Meteor.settings.discourseApiUsername,
						api_key: Meteor.settings.discourseApiKey
					},
					data: {}
				}, Meteor.bindEnvironment(function(error, result) {
					console.log(result);
				}));
			}
		}));


	},

	/////////////////////////////////////////////////////////////
	//* ---- Refreshes current user details in discourse ---- *//
	/////////////////////////////////////////////////////////////
	discourseRefreshSSOPayload: function() {
		var user = Meteor.user();
		
		if (!user) {
			throw new Meteor.Error('user-unavailable', 'User must be logged in to perform this action');
		}

		console.log(user.avatarImageUrl());

		HTTP.post('http://community.phanime.com/admin/users/sync_sso', {
			params: {
				api_username: Meteor.settings.discourseApiUsername,
				api_key: Meteor.settings.discourseApiKey				
			},
			data: {
				external_id: user._id,
				email: user.emails[0].address, // we just grab the first address
				username: user.originalUsername,
				name: (user.profile) ? user.profile.name : '',
				avatar_url: user.avatarImageUrl(),
				about_me: (user.profile) ? user.profile.about : '',
				avatar_force_update: true
			}
		}, function(error, result) {
			console.log(error);
			console.log(result);
		});

	}
});