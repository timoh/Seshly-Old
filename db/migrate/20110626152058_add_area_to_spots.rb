class AddAreaToSpots < ActiveRecord::Migration
  def self.up
    add_column :spots, :area, :string
  end

  def self.down
    remove_column :spots, :area
  end
end
