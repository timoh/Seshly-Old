class AddGmapsToSpots < ActiveRecord::Migration
  def self.up
    add_column :spots, :gmaps, :boolean
  end

  def self.down
    remove_column :spots, :gmaps
  end
end
