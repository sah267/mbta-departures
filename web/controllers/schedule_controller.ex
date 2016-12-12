defmodule MbtaDepartures.ScheduleController do
    @moduledoc """
    Schedule Controller

    # Functions
    *index - To render the index page
    *api - API route that returns JSON
    """

    use MbtaDepartures.Web, :controller

    @doc """
        Renders the Scheudle Index Page
    """
    def index(conn, _params) do
        render conn, "index.html"
    end

    @doc """
        HTTP request to get csv data, parse it and send as JSON
    """
    def api(conn, _params) do

        # Ensure all inets started
        Application.ensure_all_started :inets

        # Pattern match the request response to save the response
        {:ok, response} = :httpc.request(:get, {'http://developer.mbta.com/lib/gtrtfs/Departures.csv', []}, [], [body_format: :binary])

        # Pattern match repsonse to save the body of the response
        {{_, 200, 'OK'}, _headers, body} = response

        # Parse body using CSVLixir to a list of lists (each list is a row)
        rows = CSVLixir.parse(body)

        # Sort lists by Scheduled Departure Time
        sorted = Enum.sort tl(rows), &(Enum.at(&1, 4) < Enum.at(&2, 4))

        # Send map of parsed, sorted info in JSON format
        json conn, %{titleRow: hd(rows), bodyRows: sorted}
    end
end
