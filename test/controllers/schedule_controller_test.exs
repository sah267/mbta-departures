defmodule MbtaDepartures.ScheduleControllerTest do
  use MbtaDepartures.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "MBTA Departures!"
  end
end
