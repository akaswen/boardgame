FactoryBot.define do
  factory :game do
    to_create do |game|
      game.id = DB[:games].insert(**game.attributes)
    end

    transient do
      user { nil }
      players { 0 }
      populated { false }
      started { false }
    end

    sequence :id do |n|
      n
    end

    winner_name { nil }
    current_player_id { nil }
    tiles_in_bag { nil }
    center_tile_holder { nil }
    outside_tile_holders { nil }

    initialize_with do
      params = {
        id: id,
        started: started,
        winner_name: winner_name,
        current_player_id: current_player_id,
        tiles_in_bag: tiles_in_bag,
        center_tile_holder: center_tile_holder,
        outside_tile_holders: outside_tile_holders,
      }
      new(params)
    end

    after(:create) do |game, evaluator|
      if evaluator.populated
        TileRepo.new.populate_game(game)
        DB[:games].where(id: game.id).update(**game.attributes)
      end

      if evaluator.user && evaluator.players > 0
        game.players = create_list(:player, evaluator.players, user_id: evaluator.user.id, game_id: game.id)
        game.push_outside_tile_holders(evaluator.players)
        DB[:games].where(id: game.id).update(**game.attributes)
      end

      if evaluator.started
        game.started = true
        game.set_player_order(game.players)
        game.increment_current_player
        game.distribute_tiles_to_outside_holders
        DB[:games].where(id: game.id).update(**game.attributes)
      end
    end
  end
end
