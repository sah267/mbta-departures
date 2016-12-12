defmodule MbtaDepartures.Router do
  use MbtaDepartures.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", MbtaDepartures do
    pipe_through :browser # Use the default browser stack

    get "/", ScheduleController, :index
  end

  # Other scopes may use custom stacks.
   scope "/api", MbtaDepartures do
     pipe_through :api

     get "/schedule", ScheduleController, :api
   end
end