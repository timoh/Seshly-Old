
class AddCategoryToSpots < ActiveRecord::Migration
  def self.up
    add_column :spots, :category, :string
  end

  def self.down
    remove_column :spots, :category
  end
end
