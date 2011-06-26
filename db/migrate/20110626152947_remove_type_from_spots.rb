class RemoveTypeFromSpots < ActiveRecord::Migration
  def self.up
    remove_column :spots, :type
  end

  def self.down
    add_column :spots, :type, :string
  end
end
