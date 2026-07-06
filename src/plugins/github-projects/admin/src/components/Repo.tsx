import { Button, Checkbox, Dialog, Flex, IconButton, Td, Tr, Typography } from '@strapi/design-system';
import { Pencil, Plus, Trash, WarningCircle } from '@strapi/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { RepoData } from '../types';

interface RepoProps {
  repo: RepoData;
  selected: boolean;
  onSelect: (id: number) => void;
  onCreateProject: (repo: RepoData) => Promise<void>;
  onDeleteProject: (repo: RepoData) => Promise<void>;
}

const Repo = ({ repo, selected, onSelect, onCreateProject, onDeleteProject }: RepoProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    await onCreateProject(repo);
    setIsCreating(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDeleteProject(repo);
    setIsDeleting(false);
  };

  return (
    <Tr>
      <Td>
        <Checkbox
          aria-label={`Select ${repo.name}`}
          checked={selected}
          onCheckedChange={() => onSelect(repo.id)}
        />
      </Td>
      <Td>
        <Typography textColor="neutral800">{repo.name}</Typography>
      </Td>
      <Td>
        <Typography textColor="neutral600">{repo.shortDescription ?? '-'}</Typography>
      </Td>
      <Td>
        <a href={repo.url} target="_blank" rel="noreferrer">
          <Typography textColor="primary600">{repo.url}</Typography>
        </a>
      </Td>
      <Td>
        {repo.projectId ? (
          <Flex gap={1}>
            <Link to={`/content-manager/collection-types/plugin::github-projects.project/${repo.projectId}`}>
              <IconButton label="Edit" variant="ghost">
                <Pencil />
              </IconButton>
            </Link>
            <Dialog.Root>
              <Dialog.Trigger>
                <IconButton label="Delete" variant="ghost">
                  <Trash />
                </IconButton>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>Confirm deletion</Dialog.Header>
                <Dialog.Body icon={<WarningCircle fill="danger600" />}>
                  Are you sure you want to delete the project linked to &quot;{repo.name}&quot;? This action cannot
                  be undone.
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Cancel>
                    <Button variant="tertiary">Cancel</Button>
                  </Dialog.Cancel>
                  <Dialog.Action>
                    <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
                      Delete
                    </Button>
                  </Dialog.Action>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        ) : (
          <IconButton label="Add" variant="ghost" onClick={handleCreate} disabled={isCreating}>
            <Plus />
          </IconButton>
        )}
      </Td>
    </Tr>
  );
};

export default Repo;
