Sequel.migration do
  change do
    create_table(:tiles) do
      primary_key :id
      foreign_key :game_id, :games
      String :color
    end
  end
end
