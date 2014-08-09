import Ember from 'ember';
import Notify from 'ember-notify';

export default Ember.ObjectController.extend({

	cover_image: null,

	cover_image_url: function() {
		return "http://cdn.phanime.com/images/anime/cover/" + this.get('cover_image');
	}.property('cover_image'),
	canonical_title: null,
	romaji_title: null,
	japanese_title: null,
	type: null,
	episode_duration: null,
	season_number: null,
	start_date: null,
	slug: null,
	english_title: null,
	status: null,
	age_rating: null,
	total_episodes: null,
	end_date: null,
	description: null,
	version: null,
	title_synonyms: null,
	selectedGenres: null,

	actions: {
		addAnime: function() {
			var store = this.store;
			var self = this;
			console.log(this.get('session.currentUser.data'));

			// Some shitty validation for now 
			if (!this.get('canonical_title')) {
				Notify.warning('Please enter in an anime title');
				return; 
			}

			// Temporary way to trim / handle nulls for titles
			if (this.get('romaji_title')) {
				this.set('romaji_title', this.get('romaji_title').trim());
			}
			if (this.get('japanese_title')) {
				this.set('japanese_title', this.get('japanese_title').trim());
			}
			if (this.get('english_title')) {
				this.set('english_title', this.get('english_title').trim());
			}
			// We don't have to worry about canonical title and slug because they can never be null


			var anime = store.createRecord('anime', {
				cover_image: this.get('cover_image'),
				slug: this.get('slug').trim(),
				canonical_title: this.get('canonical_title').trim(),
				romaji_title: this.get('romaji_title'),
				japanese_title: this.get('japanese_title'),
				english_title: this.get('english_title'),
				type: this.get('type'),
				episode_duration: this.get('episode_duration'),
				season_number: this.get('season_number'),
				start_date: this.get('start_date'),
				status: this.get('status'),
				age_rating: this.get('age_rating'),
				total_episodes: this.get('total_episodes'),
				end_date: this.get('end_date'),
				description: this.get('description'),
				version: this.get('version'),
				title_synonyms: this.get('title_synonyms')
			});

			var onSuccess = function(anime) {

				var msg = anime.get('title') + " was successfully added.";
				console.log(msg);
				Notify.success(msg);
				self.transitionToRoute('anime', anime);
			};

			var onFailure = function(response) {
				var msg;

				if (response.message) {
					msg = response.message;
				} else {

					msg = "Something went wrong, anime was not added.";

				}

				console.log(msg);
				Notify.warning(msg);
			};

			anime.get('genres').then(function(genres) {
				console.log(self.get('selectedGenres'));
				genres.pushObjects(self.get('selectedGenres'));
				anime.save().then(onSuccess, onFailure);
			});

			
		},
		filesUploaded: function(data) {
			this.set('cover_image', data.name[0].name);
			console.log(this.get('cover_image_url'));
			console.log(data.name[0].name);
			console.log(this.get('cover_image'));
		},
	},


	titleChanged: function() {
		var slug = this.get('canonical_title').replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()?+']/g,"").toLowerCase();
		slug = slug.replace(/\s+/g, '-');

		// Set the the anime slug
		this.set('slug', slug);

		//console.log(slug);

	}.observes('canonical_title'),


	// Select required properties 
	// TODO: put these in the database preferably
	all_genres: function() {
		return this.store.find('genre');
	}.property(),
	anime_types: [
		"TV",
		"OVA",
		"Movie",
		"Special",
		"ONA",
	],
	anime_statuses: [
		"On-going",
		"Complete",
		"Not Yet Aired"
	],
	anime_versions: [
		"Subbed",
		"Dubbed"
	],
	age_ratings: [
		"NR - Not Rated",
		"G - All Ages",
		"PG - Children",
		"PG-13 - Teens 13 or older",
		"R - 17+ (violence & profanity)",
		"R+ - Mild Nudity",
	],
});
