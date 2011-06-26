class CreateSpots < ActiveRecord::Migration
  def self.up
    create_table :spots do |t|
      t.string :title
      t.float :latitude
      t.float :longitude
      t.string :address
      t.text :description
      t.string :type

      t.timestamps
    end
  end

  def self.down
    drop_table :spots
  end
end
