<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create admin user
        // $admin = User::create([
        //     'name' => 'Admin',
        //     'email' => 'admin@test.com',
        //     'password' => '123secret',
        // ]);

        $admin2 = User::create([
            'name' => 'Admin 2',
            'email' => 'admin2@test.com',
            'password' => '123secret',
        ]);

        //$admin->roles()->attach(Role::where('name', 'admin')->first());
        $admin2->roles()->attach(Role::where('name', 'admin')->first());
    }
}
