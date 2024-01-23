using Microsoft.AspNetCore.SignalR;
using mobile_remote_server.Classes;

namespace mobile_remote_server
{
   
    public class ConnectionHub : Hub
    {
        // <(roomId,),listOfClients>
        private static readonly Dictionary<RoomKey, List<string>> RoomUsers = new Dictionary<RoomKey, List<string>>();

        public async Task CreateRoom() {
            //check if the client is already in a room
            var roomKey = RoomUsers.FirstOrDefault(x => x.Value.Contains(Context.ConnectionId)).Key;
            if (roomKey != null)
            {
                await Console.Out.WriteLineAsync($"Room creation failed! Client is already in room {roomKey.RoomId}!");
                await Clients.Client(Context.ConnectionId).SendAsync("Message", $"Room creation failed! Client is already in room {roomKey.RoomId}!");
                return;
            }

            Random rnd = new Random();
            string roomId;
            //var roomId = Guid.NewGuid().ToString("N");

            //ensure the new roomId is not already exist
            do
            {
                roomId = rnd.Next(1, 100).ToString();
            }
            while (RoomUsers.Keys.Any(roomKey => roomKey.RoomId == roomId));

           
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Console.Out.WriteLineAsync($"Room Created: {roomId}");

            var client = new RoomKey { RoomId = roomId, CreatorConnectionId = Context.ConnectionId };
            RoomUsers[client] = new List<string> { Context.ConnectionId };

            await Clients.Caller.SendAsync("ReceiveRoomId", roomId);

            foreach (var room in RoomUsers.Keys)
            {
                await Console.Out.WriteLineAsync($"Room Id:{room.RoomId}\nCreator:{room.CreatorConnectionId}\nAllUsers:");
                foreach (var user in RoomUsers[room])
                {
                    await Console.Out.WriteLineAsync(user+"\n");
                }
            }
            
            await Console.Out.WriteLineAsync("\n\n");
        }


        public async Task JoinRoom(string roomId)
        {
            //check if the client is already in a room
            var roomKey = RoomUsers.FirstOrDefault(x => x.Value.Contains(Context.ConnectionId)).Key;
            if (roomKey != null)
            {
                await Console.Out.WriteLineAsync($"Room joining failed! Client is already in room {roomKey.RoomId}!");
                return;
            }

            // check if roomId exist
            var existingRoomKey = RoomUsers.Keys.FirstOrDefault(roomKey=>roomKey.RoomId == roomId);
            if (string.IsNullOrEmpty(roomId) || existingRoomKey == null)
            {
                await Console.Out.WriteLineAsync($"Room {roomId} does not exist or is invalid");
                await Clients.Client(Context.ConnectionId).SendAsync("Message", $"Room {roomId} does not exist or is invalid");
                return;
            }

            var users = RoomUsers[existingRoomKey];
            if (users.Count != 1 || users[0] != existingRoomKey.CreatorConnectionId)//only the room creator must be there
            {
                await Console.Out.WriteLineAsync($"Room {roomId} is already full.");
                await Clients.Client(Context.ConnectionId).SendAsync("Message", $"Room {roomId} is already full.");
                return;
            }
         
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            users.Add(Context.ConnectionId);
            Console.WriteLine($"User joined room: {roomId}");
            await Clients.All.SendAsync("ReceiveSuccessJoin", roomId);
            await Clients.All.SendAsync("ControllerSuccessJoin");
                    

            foreach (var room in RoomUsers.Keys)
            {
                await Console.Out.WriteLineAsync($"Room Id:{room.RoomId}\nCreator:{room.CreatorConnectionId}\nAllUsers:");
                foreach (var user in RoomUsers[room])
                {
                    await Console.Out.WriteLineAsync(user + "\n");
                }
            }

            await Console.Out.WriteLineAsync("\n\n");
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
            await Console.Out.WriteLineAsync(message);
        }

        public async Task SendOrientation(object orientationData)
        {
            await Clients.AllExcept(Context.ConnectionId).SendAsync("ReceiveOrientation", orientationData);
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Log the exception
            await Console.Out.WriteLineAsync($"Client {Context.ConnectionId} has disconnected");

            // Check on which room the disconnected user was at
            var roomKey = RoomUsers.FirstOrDefault(x => x.Value.Contains(Context.ConnectionId)).Key;
            if (roomKey != null)
            {

                if (Context.ConnectionId == roomKey.CreatorConnectionId)  // Check if the disconnected user is the room creator
                {
                    // Disconnect all joiners (I'm not using foreach because it's not possible while removing from the iterated list)
                    for (int i = RoomUsers[roomKey].Count - 1; i >= 0; i--)
                    {
                        var joinerConnectionId = RoomUsers[roomKey][i];
                        await Clients.Client(joinerConnectionId).SendAsync("RoomCreatorDisconnected");
                        await Groups.RemoveFromGroupAsync(joinerConnectionId, roomKey.RoomId);
                        RoomUsers[roomKey].Remove(joinerConnectionId);
                    }
                }
                else
                {
                    RoomUsers[roomKey].Remove(Context.ConnectionId);
                    await Clients.Client(roomKey.CreatorConnectionId).SendAsync("ControllerDisconnected");
                }
                
                // If the room is empty, remove the room from tracking
                if (RoomUsers[roomKey].Count <=0)
                {
                    RoomUsers.Remove(roomKey);
                }

            }

            foreach (var room in RoomUsers.Keys)
            {
                await Console.Out.WriteLineAsync($"Room Id:{room.RoomId}\nCreator:{room.CreatorConnectionId}\nAllUsers:");
                foreach (var user in RoomUsers[room])
                {
                    await Console.Out.WriteLineAsync(user + "\n");
                }
            }

            await Console.Out.WriteLineAsync("\n\n");
            await base.OnDisconnectedAsync(exception);
        }

    }
}
