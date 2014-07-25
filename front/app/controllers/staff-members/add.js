import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.ObjectController.extend({
	staff_position: null,
	actions: {
		add_staffMember: function() {

			var store = this.store;
			//var self = this;

			var staffMember = store.createRecord('staffMember', {
				person_id: this.get('selectedPerson'),
				anime_id: this.get('selectedAnime'),
				staff_position: this.get('staff_position'),
			});


			var onSuccess = function(staffMember) {
				var msg = "Staff member with staff position: " + staffMember.get('staff_position') + " was successfully added.";
				console.log(msg);
				Notify.success(msg);
			};

			var onFailure = function() {
				var msg = "Something went wrong, staff member was not added.";
				console.log(msg);
				Notify.warning(msg);
			};

			staffMember.save().then(onSuccess, onFailure);

		},
		trigger_search_anime: function() {
			var store = this.store;

			var search_results = store.filter('anime', { search: this.get('searchTextAnime') }, function(anime) {
				return 1;
				// return (anime.get('title').toLowerCase().indexOf(this.get('search_text_anime').toLowerCase()) > -1);
			});		

			this.set('animeResults', search_results);

			return false;
		},
		select_anime: function(anime) {
			this.set('selectedAnime', anime);
		},

		select_person: function(person) {
			this.set('selectedPerson', person);
		},
	},

	// Search anime
	searchTextAnime: '',
	animeResults: '',
	selectedAnime: null,

	// Search Person
	searchTextPerson: '',
	personResults: '',
	selectedPerson: null,

	// Genders
	genders: [
		"",
		"Male",
		"Female",
	]
});