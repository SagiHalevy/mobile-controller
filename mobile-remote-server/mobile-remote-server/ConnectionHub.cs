using Microsoft.AspNetCore.SignalR;

namespace mobile_remote_server
{
    public class ConnectionHub : Hub
    {
        private static readonly Dictionary<string, List<string>> RoomUsers = new Dictionary<string, List<string>>();

        public async Task CreateRoom() {

            var roomId = Guid.NewGuid().ToString("N");
            await Console.Out.WriteLineAsync($"Room Created: {roomId}");

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            RoomUsers[roomId] = new List<string> { Context.ConnectionId };

            await Clients.Caller.SendAsync("ReceiveRoomId", roomId);
        }


        public async Task JoinRoom(string roomId)
        {
            if (!string.IsNullOrEmpty(roomId) && RoomUsers.TryGetValue(roomId, out var users))
            {
                if (users.Count < 2)
                {
                    users.Add(Context.ConnectionId);
                    await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                    Console.WriteLine($"User joined room: {roomId}");
                    await Clients.All.SendAsync("ReceiveSuccessJoin", roomId);
                    await Clients.All.SendAsync("ControllerSuccessJoin");
                    
                }
                else
                {
                    Console.WriteLine($"Room {roomId} is already full.");
                }
            }
            else
            {
                Console.WriteLine($"Room does not exist or is invalid: {roomId}");
            }
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
            await Console.Out.WriteLineAsync(message);
        }

        public async Task SendOrientation(object orientationData)
        {
   
            await Console.Out.WriteLineAsync("something orieneteiaton");
            await Console.Out.WriteLineAsync(orientationData.ToString());
            await Clients.All.SendAsync("ReceiveOrientation", orientationData);
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Log the exception
            Console.WriteLine($"Client disconnected with error: {exception?.Message}");

            await base.OnDisconnectedAsync(exception);
        }

    }
}
