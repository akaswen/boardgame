class GameRepo
  def initialize
    @model = DB[:games]
  end

  def find(game_id)
    data = @model.first(id: game_id)
    game = Game.new(data)

    game
  end

  def get_all
    data = @model.all
    data.map { |data| Game.new(data) }
  end

  def create
    id = @model.insert
    game = Game.new(@model.where(id: id).first)
  end

  def update(game)
    raise ModelNotFoundError.new("game not yet saved, cannot be updated") unless game.id

    @model.where(id: game.id).update(**game.attributes)
  end

  def make_current_player_nil(game)
    @model.where(id: game.id).update(current_player_id: nil)
  end

  def delete(game_id)
    @model.where(id: game_id).delete
  end
end
