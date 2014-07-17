<?php

class EpisodeController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$ids = Input::get('ids');
		$anime_id = Input::get('anime_id');
		$episode_number = Input::get('episode_number');

		if ($ids) {
			$episodes = Episode::with('videos')->whereIn('id', $ids)->get();
		} else if ($anime_id && $episode_number) {
			$episodes = Episode::with('videos')->where('anime_id', '=', $anime_id)->where('episode_number', '=', $episode_number)->get();
		}


		$outputEpisodes = [];

		foreach ($episodes as $episode) {
			$outputEpisode = $episode->toArray();
			$outputEpisode['episode_version'] = unserialize($outputEpisode['episode_version']);
			$outputEpisode['videos'] = $episode->videos->lists('id');
			$outputEpisodes[] = $outputEpisode;
		}

		return Response::json(array(
			'episodes' => $outputEpisodes),
			200
		);

	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$episode = Episode::find($id);
		$videos = $episode->videos;

		$episode = $episode->toArray();

		$episode['episode_version'] = unserialize($episode['episode_version']);

		// Encode videos into episodes the way Ember.js likes it
		$episode['videos'] = array();

		foreach($videos as $video) {
			$episode['videos'][] = $video['id'];
		}

		return Response::json(array(
			'episode' => $episode
			),
			200
		);

	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		// Get needed data
		$episode = Episode::find($id);
		$inputs = Input::get('episode');

		// Update episode fields
		$episode->episode_name = $inputs['episode_name'];
		$episode->episode_multiple = $inputs['episode_multiple'];
		$episode->episode_number = $inputs['episode_number'];
		$episode->episode_number_other = $inputs['episode_number_other'];
		$episode->episode_title = $inputs['episode_title'];
		$episode->episode_air_date = $inputs['episode_air_date'];
		$episode->episode_already_aired = $inputs['episode_already_aired'];
		$episode->episode_version = serialize($inputs['episode_version']);

		$episode->save();

		// Call show
		$episode = Episode::find($id);
		$videos = $episode->videos;

		$episode = $episode->toArray();

		$episode['episode_version'] = unserialize($episode['episode_version']);

		// Encode videos into episodes the way Ember.js likes it
		$episode['videos'] = array();

		foreach($videos as $video) {
			$episode['videos'][] = $video['id'];
		}

		return Response::json(array(
			'episode' => $episode
			),
			200
		);		

	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}