<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Real-time Chat') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <div class="flex h-[600px]">
                        <!-- Users List -->
                        <div class="w-1/4 border-r pr-4 overflow-y-auto">
                            <h3 class="font-bold mb-4">Users</h3>
                            <div id="users-list" class="space-y-2">
                                @foreach($users as $user)
                                    <div class="user-item p-3 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition" data-user-id="{{ $user->id }}">
                                        <div class="font-medium">{{ $user->name }}</div>
                                        <div class="text-sm text-gray-500">{{ $user->email }}</div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        <!-- Chat Area -->
                        <div class="w-3/4 pl-4 flex flex-col">
                            <div id="chat-header" class="border-b pb-3 mb-3">
                                <h3 class="font-bold text-lg">Select a user to start chatting</h3>
                            </div>
                            
                            <div id="messages-container" class="flex-1 overflow-y-auto mb-4 space-y-2 bg-gray-50 p-4 rounded-lg">
                                <p class="text-gray-500 text-center">Select a user to start chatting</p>
                            </div>

                            <div class="border-t pt-4">
                                <form id="message-form" class="flex gap-2">
                                    @csrf
                                    <input type="hidden" id="receiver_id" name="receiver_id" value="">
                                    <input type="text" id="message-input" name="message" placeholder="Type your message..." class="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                                    <button type="submit" id="send-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50" disabled>
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>