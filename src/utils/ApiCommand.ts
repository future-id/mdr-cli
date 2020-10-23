import Api from "../api";
import { Command } from "clime";

export abstract class ApiCommand extends Command {
    api = new Api();
}

export default ApiCommand;
