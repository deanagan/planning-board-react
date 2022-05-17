using Microsoft.AspNetCore.SignalR;
using RealTimeChat.Service;

namespace RealTimeChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly string _botUser;
        public ChatHub()
        {
            _botUser = "Chat Bot";
        }
        public async Task JoinRoom(UserConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room ?? "Default");
            await Clients.Group(userConnection.Room ?? "Default").SendAsync("ReceiveMessage", _botUser, $"{userConnection.Name} has joined {userConnection.Room}");
        }
    }
}
